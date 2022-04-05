import { argv } from 'yargs';
import { Configuration } from '../config';
import { App } from './app';

const application = new App(new Configuration());

application.command(argv);
