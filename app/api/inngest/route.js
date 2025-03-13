import { serve } from 'inngest/next';
import {
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
} from '@/config/inngest'; // Não é necessário importar o "inngest" aqui

// Criando uma API que serve as funções do Inngest
export const { GET, POST, PUT } = serve({
  functions: [syncUserCreation, syncUserUpdation, syncUserDeletion],
});
