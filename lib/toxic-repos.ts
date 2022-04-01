import axios from 'axios';

interface ToxicRepo {
  datetime: string;
  problem_type: string;
  name: string;
  description: string;
  commit_link: string;
}

export type ToxicRepoMap = Map<string, ToxicRepo>;

export const getToxicRepos = async (): Promise<ToxicRepoMap> => {
  const { data } = await axios.get<ToxicRepo[]>(
    'https://raw.githubusercontent.com/stravnik/toxic-repos/main/data/json/toxic-repos.json'
  );
  return new Map<string, ToxicRepo>(data.map(repo => [repo.name, repo]));
};
