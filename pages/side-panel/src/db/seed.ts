import { TaskHistory } from './model';

export const seed: Omit<TaskHistory, 'id'>[] = [
  {
    sourceContent:
      'Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?Hello, how are you?',
    targetLanguage: 'ja',
    taskType: 'POLISHING',
    modelVersion: 'GPT-3.5-turbo',
    modelTemperature: 0.7,
    generatedContent: 'fine thank you',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    isVisitable: true,
  },
  {
    sourceContent: 'nihaoma',
    targetLanguage: 'ja',
    taskType: 'TRANSLATION',
    modelVersion: 'GPT-4.0',
    modelTemperature: 0.6,
    generatedContent: 'こんにちは',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    isVisitable: true,
  },
  {
    sourceContent: 'Good morning, have a nice day!',
    targetLanguage: 'fr',
    taskType: 'TRANSLATION',
    modelVersion: 'GPT-3.5-turbo',
    modelTemperature: 0.5,
    generatedContent: 'Bonjour, passez une bonne journée!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    isVisitable: true,
  },
  {
    sourceContent: 'The quick brown fox jumps over the lazy dog.',
    targetLanguage: 'de',
    taskType: 'POLISHING',
    modelVersion: 'GPT-4.0',
    modelTemperature: 0.8,
    generatedContent: 'Der schnelle braune Fuchs springt über den faulen Hund.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
    isVisitable: false,
  },
  {
    sourceContent: 'Can you help me with this code snippet?',
    targetLanguage: 'es',
    taskType: 'TRANSLATION',
    modelVersion: 'GPT-3.5-turbo',
    modelTemperature: 0.65,
    generatedContent: '¿Puedes ayudarme con este fragmento de código?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    isVisitable: true,
  },
  {
    sourceContent: 'I love programming!',
    targetLanguage: 'it',
    taskType: 'POLISHING',
    modelVersion: 'GPT-4.0',
    modelTemperature: 0.7,
    generatedContent: 'Amo programmare!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    isVisitable: false,
  },
];
