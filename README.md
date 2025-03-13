# Analizador de Imágenes

Este proyecto es una aplicación web que permite a los usuarios subir imágenes y descubrir qué animales identifica nuestra IA.

## Requisitos

Antes de empezar a trabajar en el proyecto, necesitarás configurar tus variables de entorno locales.

## Variables de entorno

Las variables de entorno se almacenan en un archivo `.env` que **no debe ser subido al repositorio** por razones de seguridad. Este archivo contiene información sensible como claves de API o credenciales necesarias para ejecutar el proyecto correctamente.

### Cómo configurar tu archivo `.env`

1. **Copia el archivo `.env.example` a `.env`**

   Si el archivo `.env.example` está presente en el repositorio, copia su contenido a un archivo `.env` en la raíz del proyecto.

   ```bash
   cp .env.example .env

2. **Rellena las variables de entorno**

Abre el archivo .env y completa las variables necesarias. Por ejemplo:

```bash
REACT_APP_API_KEY=your_api_key_here
REACT_APP_OTHER_SECRET=other_secret_here

Asegúrate de sustituir los valores por tus propias claves o credenciales.

3. **No subas el archivo .env al repositorio**

El archivo .env está en el archivo .gitignore, lo que significa que no debe ser subido al repositorio. Asegúrate de mantener este archivo localmente y de nunca incluirlo en un commit.

## Otros detalles de configuración

Este proyecto usa React y requiere Node.js para ejecutarse. Asegúrate de tener instalado Node.js en tu máquina.

## Instalación

1. Clona este repositorio:

```bash
git clone https://github.com/tu-usuario/analizador-de-imagenes.git

2. Navega a la carpeta del proyecto:

```bash
cd analizador-de-imagenes

3. Instala las dependencias:

```bash
npm install

4. Ejecuta la aplicación:

```bash
npm start

## Contribución
Si deseas contribuir al proyecto, por favor sigue los siguientes pasos:

1. Haz un fork de este repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`).
3. Realiza tus cambios.
4. Haz commit de tus cambios (`git commit -am 'Añadir nueva característica`).
5. Haz push de tus cambios a tu fork (`git push origin feature/nueva-caracteristica`).
6. Crea un pull request.

## Licencia
Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).
