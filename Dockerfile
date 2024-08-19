# Need to update version to match current playwright version in the framework
FROM mcr.microsoft.com/playwright:v1.46.1-jammy
# Create working directory
RUN mkdir /app
# Set working directory
WORKDIR /app
# Copy project files to working directory
COPY . /app/

# Install dependencies
# RUN npm install
RUN npm install --force
# Install Playwright and browsers
RUN npx playwright install