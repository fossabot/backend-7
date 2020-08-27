import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DynamicModule } from '@nestjs/common';

let mongod: MongoMemoryServer;

export default (customOpts: MongooseModuleOptions = {}): DynamicModule =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = new MongoMemoryServer();
      await mongod.start()
      const uri = await mongod.getUri();
      return {
        uri,
        ...customOpts,
      };
    },
  });

export const closeMongoConnection = async (): Promise<void> => {
  if (mongod) await mongod.stop();
};
