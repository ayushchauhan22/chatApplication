import ChatRequest from '../modelsDB/chatRequest';
import Conevrsation from '../modelsDB/conversation';
import { Request, Response } from 'express';
import {
    chatRequestSchema,
    chatRequestIdSchema,
} from '../schema/chatRequestSchema';
import { Types } from 'mongoose';

export const sendChatRequest = async (req: Request, res: Response) => {

    // Zod validation
    const result = chatRequestSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json(result.error.flatten());
    }

    const { senderId, receiverId } = result.data;

    const existingRequest = await ChatRequest.findOne({
        senderId,
        receiverId,
    });

    // check if conversation already exists between sender and receiver
    const existingConversation = await Conevrsation.findOne({
        members: { $all: [senderId, receiverId] },
    });

    if (existingConversation) {
        return res
            .status(400)
            .json({ error: 'Conversation already exists between these users' });
    }

    if (!existingRequest) {
        const chatRequest = await ChatRequest.create({
            sender_id: new Types.ObjectId(senderId),
            receiver_id: new Types.ObjectId(receiverId),
        });
        res.status(201).json(chatRequest);
    } else {
        res.status(400).json({ error: 'Already requested to this user' });
    }
};

export const getIncomingChatRequests = async (req: Request, res: Response) => {

    // Zod validation
    const result = chatRequestIdSchema.safeParse(req.params);
    if (!result.success) {
        return res.status(400).json(result.error.flatten());
    }


    const userId = req.params.userId;
    const chatRequests = await ChatRequest.find({
        receiver_id: userId,
        status: 'pending',
    }).populate('sender_id', 'name email');


    res.json(chatRequests);
};

export const getOutgoingChatRequests = async (req: Request, res: Response) => {

    // Zod validation
    const result = chatRequestIdSchema.safeParse(req.params);
    if (!result.success) {
        return res.status(400).json(result.error.flatten());
    }


    const userId = req.params.userId;
    const chatRequests = await ChatRequest.find({
        sender_id: userId,
        status: 'pending',
    }).populate('receiver_id', 'name email');


    res.json(chatRequests);
};

export const acceptChatRequest = async (req: Request, res: Response) => {

    // Zod validation
    const result = chatRequestIdSchema.safeParse(req.params);
    if (!result.success) {
        return res.status(400).json(result.error.flatten());
    }


    const requestId = req.params.requestId;
    const chatRequest = await ChatRequest.findByIdAndUpdate(
        requestId,
        { status: 'accepted' },
        { new: true },
    )
        .populate('sender_id', 'name email')
        .populate('receiver_id', 'name email');


    res.json(chatRequest);
};

export const rejectChatRequest = async (req: Request, res: Response) => {


    // Zod validation
    const result = chatRequestIdSchema.safeParse(req.params);
    if (!result.success) {
        return res.status(400).json(result.error.flatten());
    }

    const requestId = req.params.requestId;
    const chatRequest = await ChatRequest.findByIdAndUpdate(
        requestId,
        { status: 'rejected' },
        { new: true },
    )
        .populate('sender_id', 'name email')
        .populate('receiver_id', 'name email');

    res.json(chatRequest);
};
