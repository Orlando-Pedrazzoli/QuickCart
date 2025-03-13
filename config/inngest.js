import { Inngest } from 'inngest';
import connectDB from './db';
import User from '@/models/User';

// Criação do cliente para enviar e receber eventos
export const inngest = new Inngest({ id: 'quickcart-next' });

// Função Inngest para salvar dados de usuário no banco de dados
export const syncUserCreation = inngest.createFunction(
  {
    id: 'sync-user-from-clerk',
    event: 'clerk/user.created', // Evento correto
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      imageUrl: image_url,
    };

    await connectDB();
    await User.create(userData);
  }
);

// Função Inngest para atualizar dados de usuário
export const syncUserUpdation = inngest.createFunction(
  {
    id: 'update-user-from-clerk',
    event: 'clerk/user.updated', // Evento correto
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      imageUrl: image_url,
    };

    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

// Função Inngest para deletar o usuário do banco de dados
export const syncUserDeletion = inngest.createFunction(
  {
    id: 'delete-user-with-clerk',
    event: 'clerk/user.deleted', // Evento correto
  },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();
    await User.findByIdAndDelete(id);
  }
);
