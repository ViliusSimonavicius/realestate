# Naudojame lengvą Node.js versiją
FROM node:20-slim

# Nustatome darbinį aplanką konteinerio viduje
WORKDIR /app

# Nukopijuojame package failus pirmiausia (dėl greitesnio build'o)
COPY package*.json ./

# Įdiegiame priklausomybes
RUN npm install

# Nukopijuojame visą likusį kodą
COPY . .

# Atidarome prievadą SvelteKit'ui
EXPOSE 5173

# Paleidžiame serverį su host vėliavėle
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]