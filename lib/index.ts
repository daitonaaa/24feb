import { argv } from 'yargs';
import { Configuration } from '../config';
import { NodeModulesCheck } from './nodeModulesReviewer';

const application = new NodeModulesCheck(new Configuration());

application.command(argv);
