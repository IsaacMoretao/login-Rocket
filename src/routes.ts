import { FastifyInstance } from "fastify"
import { z } from "zod";
import { prisma } from "./lib/prisma"


export async function appRoutes(app: FastifyInstance) {

  app.get('/users', async (request) => {
    console.log(request.body)
    
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

    return user != null
    
  })


  app.post('/users', async (request) => {
    const createTshirts = z.object({
      name: z.string(),
      password: z.string(),

    })

    const {
      name,
      password

    } = createTshirts.parse(request.body)
  
    await prisma.users.create({
      data: {
        name,
        password

      }
    })
  
    })

}