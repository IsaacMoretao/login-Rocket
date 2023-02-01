import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma";

export async function appRoutes(app: FastifyInstance) {

  app.put('/users/:id', async (request) => {
    
    const updateBody = z.object({
      
      name: z.string(),
      password: z.string(),
      avatarUrl: z.string()
    })

    

    const { name, password, avatarUrl } = updateBody.parse(request.body)
    const { id }: String = request.params
    
    const result = await prisma.users.update({
      where: {
        id
      }, 
      data: {
        name,
        password,
        avatarUrl
      }
      
    });

    console.log(result)
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