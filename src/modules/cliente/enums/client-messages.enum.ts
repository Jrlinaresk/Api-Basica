export enum ClientMessages {
  CLIENT_CREATED_SUCCESSFULLY = 'Cliente creado exitosamente.',
  BAD_REQUEST = 'Solicitud incorrecta.',
  CLIENT_FOUND = 'Cliente encontrado.',
  CLIENT_NOT_FOUND = 'Cliente no encontrado.',
  CLIENT_BY_EMAIL_FOUND = 'Cliente por email encontrado.',
  ALL_CLIENTS_LIST = 'Lista de todos los clientes registrados.',
  CLIENTS_FOUND = 'Lista de clientes encontrados.',
  PASSWORD_UPDATED_SUCCESSFULLY = 'Contraseña actualizada exitosamente.',
  CLIENTS_PAGINATED = 'Clientes paginados.',
  CLIENT_UPDATED = 'Cliente actualizado.',
  CLIENT_DELETED_SUCCESSFULLY = 'Cliente eliminado exitosamente.',
  EMAIL_ALREADY_REGISTERED = 'El correo electrónico ya está registrado.',
  PHONE_ALREADY_REGISTERED = 'El número de teléfono ya está registrado.',
  CLIENTS_RETRIEVAL_ERROR = 'Error al recuperar los clientes.',
  EMAIL_IN_USE = 'El email ya está en uso por otro cliente.',
  INVALID_CLIENT_ID = 'El ID de cliente proporcionado no es válido',
  DELETE_CLIENT_ERROR = 'Error al intentar eliminar el cliente: ',
}
