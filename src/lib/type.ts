export interface Character {
	id: number;
	name: string;
	image: string;
	status: string;
  species: string;
  gender: string;
	origin: {
		name: string;
	};
	location: {
		name: string;
  };
  created: string;
  episode: string[];
}

export interface CharacterDetail extends Character {
	status: string;
	species: string;
	origin: { name: string };
	location: { name: string };
}
