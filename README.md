# Analizador de Imágenes

Este proyecto es una aplicación web que permite a los usuarios subir imágenes y descubrir qué animales identifica una IA utilizando la API de Hugging Face para el análisis de imágenes y la API de Wikipedia para descripciones adicionales.

## Requisitos

Antes de empezar a trabajar en el proyecto, necesitarás configurar tus variables de entorno locales y tener una cuenta en Hugging Face para obtener un token de API.

## Variables de entorno

Las variables de entorno se almacenan en un archivo `.env` que **no debe ser subido al repositorio** por razones de seguridad. Este archivo contiene información sensible como claves de API necesarias para ejecutar el proyecto correctamente.

### Cómo configurar tu archivo `.env`

1. **Copia el archivo `.env.example` a `.env`**

   Si el archivo `.env.example` está presente en el repositorio, copia su contenido a un archivo `.env` en la raíz del proyecto. Si no existe, crea uno nuevo.

   ```bash
   cp .env.example .env
   ```

2. **Rellena las variables de entorno**

Abre el archivo .env y completa las variables necesarias. Para este proyecto, solo necesitas el token de Hugging Face:

```bash
HUGGINGFACE_API_TOKEN=hf_xxxxxx
```

  . HUGGINGFACE_API_TOKEN: Tu token de acceso a la Inference API de Hugging Face. Obtén uno desde [Hugging Face - Tokens de acceso](https://huggingface.co/settings/tokens).

  . Nota: No uses el prefijo REACT_APP_ ni VITE_ para esta variable, ya que se usa en las funciones de Netlify, no en el frontend directamente.


3. **No subas el archivo .env al repositorio**

El archivo `.env` está incluido en el archivo `.gitignore` para evitar que se suba al repositorio. Mantén este archivo localmente y nunca lo incluyas en un commit.

## Otros detalles de configuración

Este proyecto usa React y requiere Node.js para ejecutarse. Asegúrate de tener instalado Node.js en tu máquina.

## Instalación

1. Clona este repositorio:

```bash
git clone https://github.com/tu-usuario/analizador-de-imagenes.git
```

2. Navega a la carpeta del proyecto:

```bash
cd analizador-de-imagenes
```

3. Instala las dependencias:

```bash
npm install
```

4. Ejecuta la aplicación en desarrollo:

  Este proyecto utiliza Netlify Functions, por lo que necesitas usar netlify dev para probarlo localmente:

  ```bash
  npx netlify dev
  ```

  . Esto inicia el servidor de desarrollo en `http://localhost:8888` y hace que las funciones de Netlify estén disponibles.

  . Nota: Asegúrate de tener el CLI de Netlify instalado (`npm install -g netlify-cli`) si no lo tienes aún.

## Despliegue en Netlify

Para desplegar el proyecto en Netlify:

1. Configura las variables de entorno en Netlify:
  . Ve a tu panel de Netlify > Configuración del sitio > Variables de entorno.

  . Añade:

  ```bash
  HUGGINGFACE_API_TOKEN=hf_xxxxxx
  ```

2. Despliega el proyecto:

  ```bash
  npx netlify deploy --prod
  ```

  O conecta tu repositorio a Netlify para despliegues automáticos.

## Tecnologías utilizadas
. Frontend: React, TypeScript, Vite (si usas Vite como bundler).
. Backend: Netlify Functions para proxy a la API de Hugging Face.
. APIs: 
  . Hugging Face Inference API (`google/vit-base-patch16-224`).
  . Wikipedia REST API para descripciones.

## Estructura del proyecto
. `src/services/api.ts`: Lógica para procesar imágenes y obtener información de Wikipedia.

. `netlify/functions/huggingface-proxy.ts`: Función de Netlify que actúa como proxy para la API de Hugging Face.

. `src/components/AnimalInfo.tsx`: Componente para mostrar los resultados del análisis.


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
