import { Request, Response } from 'express';
import { Prisma, Role } from '@prisma/client';
import ApiException from '../errors/ApiException';
import prisma from '../database/Prisma';
import validate from '../services/ValidationService';
import { createTodoValidation } from '../validations/TodoValidation';
import BlockchainService from '../blockchain/services/BlockchainService';
import Socket from '../services/Socket';
import sortTodo from '../services/AiService';

export async function get(req: Request, res: Response) {
  try {
    const { user, pagination } = req.body;
    const { page, limit, offset } = pagination;

    const where: Prisma.ToDoWhereInput = {};
    const orderBy: Prisma.ToDoOrderByWithRelationInput = {
      createdAt: 'desc',
    };

    if (user.roles !== Role.ADMIN) {
      where.user = {
        id: user.id,
      };
    }

    const todos = await prisma.toDo.findMany({
      where,
      skip: offset,
      take: limit,
      include: { user: true },
      orderBy,
    });

    return res.status(200).json({
      success: true,
      message: 'Todos fetched',
      data: {
        todos,
        pagination: {
          page,
          limit,
          total: await prisma.toDo.count({ where }),
        },
      },
    });
  } catch (error) {
    if (error instanceof ApiException) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
        errors: error.data,
      });
    }
    throw error;
  }
}

export async function validateStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const todo = await prisma.toDo.findUnique({
      where: {
        id,
      },
    });

    if (!todo) {
      throw new ApiException('Todo not found', 404);
    }

    const status = await BlockchainService.getStatus(id);

    if (status !== todo.status) {
      throw new ApiException('Status mismatch', 400);
    }

    return res.status(200).json({
      success: true,
      message: 'Todo status fetched',
      data: {
        status,
      },
    });
  } catch (error) {
    if (error instanceof ApiException) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
        errors: error.data,
      });
    }
    throw error;
  }
}

export async function create(req: Request, res: Response) {
  try {
    const { title, description, user } = req.body;

    const { hasError, errors } = validate(createTodoValidation, {
      title,
      description,
    });

    if (hasError) {
      throw new ApiException('Validation error', 422, errors);
    }

    const todo = await prisma.toDo.create({
      data: {
        title,
        description,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    await BlockchainService.createTask(todo.id);
    Socket.emit('refetchTodo', {});

    return res.status(201).json({
      success: true,
      message: 'Todo created',
      data: todo,
    });
  } catch (error) {
    if (error instanceof ApiException) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
        errors: error.data,
      });
    }
    throw error;
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const todo = await prisma.toDo.findUnique({
      where: {
        id,
      },
    });

    if (!todo) {
      throw new ApiException('Todo not found', 404);
    }

    const currentStatus = await BlockchainService.getStatus(id);

    if (currentStatus !== todo.status) {
      throw new ApiException('Status mismatch', 400);
    }

    const updatedTodo = await prisma.toDo.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    await BlockchainService.updateTask(id, status);
    Socket.emit('refetchTodo', {});

    return res.status(200).json({
      success: true,
      message: 'Todo updated',
      data: updatedTodo,
    });
  } catch (error) {
    if (error instanceof ApiException) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
        errors: error.data,
      });
    }
    throw error;
  }
}
