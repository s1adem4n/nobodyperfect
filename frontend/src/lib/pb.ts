import PocketBase, { RecordService } from 'pocketbase';

export interface Base {
	id: string;
	created: string;
	updated: string;
}

export interface Answer extends Base {
	round: string;
	text: string;
	player: string;
}

export interface Game extends Base {
	name: string;
}

export interface Round extends Base {
	game: string;
	question: string;
	correctAnswer: string;
}

interface TypedPocketBase extends PocketBase {
	collection(idOrName: string): RecordService;
	collection(idOrName: 'answers'): RecordService<Answer>;
	collection(idOrName: 'games'): RecordService<Game>;
	collection(idOrName: 'rounds'): RecordService<Round>;
}

export const pb = new PocketBase(window.location.origin) as TypedPocketBase;
