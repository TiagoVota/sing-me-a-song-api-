import prisma from '../../src/database/database'

import {
	CreateRecommendationData
} from '../../src/services/recommendationsService'


const createRecommendation = async (body?: CreateRecommendationData) => {
	const defaultBody = {
		name: 'Falamansa - Xote dos Milagres',
		youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y'
	}

	const validBody = body ?? defaultBody

	const recommendation = await prisma.recommendation.create({
		data: validBody,
	})

	return recommendation
}


const findRecommendationById = async (name: string) => {
	const recommendation = await prisma.recommendation.findUnique({
		where: { 
			name,
		},
	})

	return recommendation
}


export {
	createRecommendation,
	findRecommendationById,
}
