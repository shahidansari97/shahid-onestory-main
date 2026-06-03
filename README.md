# One Story

## Prerequisites

Ensure you have the following installed:
- PHP >= 8.0
- Composer
- MySQL
- Node.js & npm

## Local server
You can use https://herd.laravel.com/ as a local server.

## Installation

Follow these steps to set up the project:

1. **Clone the Repository**

   ```sh
   git clone https://github.com/smartpipl/one.story.git
   
2. **Install Dependencies**

   ```
   composer install
   npm install
3. **Set Up Environment Variables**

    The .env file in Laravel should be located in the root directory of your project.
    Make sure the database is created and configured in the .env file.
4. **Run Migrations**
   ```
   php artisan migrate --seed
   
5. **Compile Assets**
   ```
   npm run dev

6. **Access to the admin panel**

   Visit https://local.site/login to access the admin panel.
