import { faker } from '@faker-js/faker'

import prisma from '../../src/database/database'


const validBodyFactory = (bodyInfo?) => {
	const fakerName = faker.datatype.string()
	const fakerYoutubeLink = `https://www.youtube.com/watch?v=${faker.datatype.string()}`
	const fakerScore = faker.datatype.number({ min: -3 })

	const body = {
		name: bodyInfo?.name ?? fakerName,
		youtubeLink: bodyInfo?.youtubeLink ?? fakerYoutubeLink,
		score: bodyInfo?.score ?? fakerScore
	}

	return body
}


const createRecommendation = async (bodyInfo?) => {
	const body = validBodyFactory(bodyInfo)

	const recommendation = await prisma.recommendation.create({
		data: body,
	})

	return recommendation
}


const createRecommendationList = async () => {
	const createRecommendationQqt = faker.datatype.number({ min: 5, max: 20})
	const createPromisesList = []
	for (let i = 0; i < createRecommendationQqt; i++) {
		createPromisesList.push(createRecommendation())
	}
	await Promise.all(createPromisesList)
}


const findRecommendationByName = async (name: string) => {
	const recommendation = await prisma.recommendation.findUnique({
		where: { 
			name,
		},
	})

	return recommendation
}


const findFistRecommendation = async () => {
	const recommendation = await prisma.recommendation.findFirst()

	return recommendation
}


const generateRecommendationId = () => {
	return faker.datatype.number({ min: 1 })
}


const generateRandomAmount = () => {
	const amount = faker.datatype.number({ min: 5, max: 20 })

	return amount
}


export {
	validBodyFactory,
	createRecommendation,
	findRecommendationByName,
	findFistRecommendation,
	generateRecommendationId,
	createRecommendationList,
	generateRandomAmount,
}
