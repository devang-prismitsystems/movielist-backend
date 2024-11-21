import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Utils } from '../utils/utils';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

const getList = async (req: any, res: Response) => {
    try {
        const user_id = req.user.id;
        const { page = 1, pageSize = 8, year, title } = req.query;

        const filters: any = {
            user_id: user_id,
        };

        if (year) {
            filters.publish_year = parseInt(year as string);
        }

        if (title) {
            filters.title = {
                contains: title as string,
                mode: "insensitive",
            };
        }

        const totalRecords = await prisma.movies.count({
            where: filters,
        });

        const totalPages = Math.ceil(totalRecords / parseInt(pageSize as string));

        const moviesList = await prisma.movies.findMany({
            where: filters,
            select: {
                id: true,
                title: true,
                publish_year: true,
                poster: true,
                updated_at: true,
            },
            orderBy: {
                updated_at: 'desc',
            },
            skip: (parseInt(page as string) - 1) * parseInt(pageSize as string),
            take: parseInt(pageSize as string),
        });

        res.status(200).json({
            success: true,
            data: moviesList,
            totalPages: totalPages,
            totalRecords: totalRecords,
            currentPage: parseInt(page as string),
            message: "Movies list fetched successfully",
        });
    } catch (error: any) {
        console.log('error: ', error);
        res.status(500).send({ success: false, error: error.message });
    }
};



const createMovie = async (req: any, res: Response) => {
    try {
        const { title, publish_year } = req.body;
        const { poster } = req.files;

        if (!title && !publish_year && !poster) {
            return res.status(400).json({ success: false, error: "Title, publish year, and poster are required" });
        }
        let posterImg: any;
        if (poster) {
            posterImg = await Utils.imageUpload(poster, res);
        }
        await prisma.movies.create({
            data: {
                title,
                poster: posterImg,
                user_id: req.user.id,
                publish_year: +publish_year
            }
        })
        res.status(200).json({ success: true, message: "Movie created successfully" });
    } catch (error: any) {
        console.log('error: ', error);
        res.status(500).json({ success: false, error: error.message })
    }
}

const updateMovie = async (req: any, res: Response) => {
    try {
        const { id, title, publish_year } = req.body;
        const poster = req.files && req.files.poster;
        if (!id) {
            return res.status(400).json({ success: false, message: "Movie ID is required" });
        }
        const data: any = {};
        if (title) {
            data.title = title;
        }
        if (publish_year) {

            data.publish_year = +publish_year;
        }
        if (poster) {
            const posterImg = await Utils.imageUpload(poster, res);
            data.poster = posterImg;
        }

        const updatedMovie = await prisma.movies.update({
            where: { id: +id },
            data,
        });

        res.status(200).json({ success: true, message: "Movie updated successfully", data: updatedMovie });
    } catch (error: any) {
        console.error("Error updating movie:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getMovieDetails = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const getMovie = await prisma.movies.findUnique({
            where: { id: +id }
        });
        res.status(200).json({ success: true, data: getMovie, message: "Movie details fetched successfully" });
    } catch (error: any) {
        console.log('error: ', error);
        res.status(500).json({ success: false, error: error.message })
    }
}

module.exports = { getList, createMovie, updateMovie, getMovieDetails };