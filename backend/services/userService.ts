import User from '../modelsDB/user';
import Conversation from '../modelsDB/conversation';

export const createUser = async (
  phone: number,
  name: string,
  email: string,
  password: string,
) => {
  return await User.create({
    phone,
    name,
    email,
    password,
    last_seen: new Date(),
  });
};

export const findUserByName = async (name: string, excludeId: string) => {
  return await User.find({
    name: { $regex: name, $options: 'i' }, 
    _id: { $ne: excludeId },
  }).select('_id name email phone');
};

export const findUser = async (details: object) => {
  return await User.findOne(details);
};

export const updateUser = async (filter: object, data: object) => {
  return await User.updateOne(filter, data);
};

export const findUserByPhone = async (phone: number) => {
  return await User.aggregate([
    {
      $addFields: {
        phoneStr: { $toString: '$phone' }, 
      },
    },
    {
      $match: {
        phoneStr: { $regex: `^${phone}` }, 
      },
    },
    {
      $project: { name: 1, phone: 1 }, 
    },
    {
      $limit: 20,
    },
  ]);
};


export const getUserById = async (id: string) => {
  return await User.findById(id, {
    name: 1,
    email: 1,
    phone: 1,
    last_seen: 1,
    s_online: 1,
  });
};

export const allChatUser = async (id: string) => {
  return Conversation.find({
    participants: id,
  })
    .populate('participants', 'name email phone')
    .select('participants');
}