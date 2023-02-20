import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma";

export async function appRoutes(app: FastifyInstance) {

  interface User {
    name: string;
    avatarUrl: string;
    password: string;
  }
  
  app.put<{ Params: { id: string }, Body: User }>('/users/:id', async (request, reply) => {
    const id = request.params.id;
    const { name, avatarUrl, password } = request.body;
  
    try {
      const user = await prisma.users.update({
        where: { id },
        data: { name, avatarUrl, password },
      });

      reply.send(user);
    } catch (error) {
      console.error(error);
      reply.status(500).send('Something went wrong');
    }
  });

  app.post('/users/log', async (request) => {
    
    const createHabitBody = z.object({
      name: z.string(),
      password: z.string(),
    })
  
    const { name, password } = createHabitBody.parse(request.body)

    const user = await prisma.users.findFirst({
      where:{
        AND: {
          name, 
          password
        }
      }
    })

    if ( user != null) {
      return user
      
    } else {
      return 'usuário não encontrado'
    }
  })

  app.post('/users', async (request) => {

    const createHabitBody = z.object({
      name: z.string(),
      password: z.string(),

    })
  
    const { name, password } = createHabitBody.parse(request.body)

    const user = await prisma.users.findFirst({
      where:{
        AND: {
          name
        }
      }
    })

    if ( user != null) {

      return 'Esse usuário já existe'
      
    } else {

      await prisma.users.create({
        data: {
          name,
          password
  
        }
      })

      return 'Usuário criado com sucesso'

    }
  })
}



