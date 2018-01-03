export type Payload = string | any;
export type Callback = () => void;

export interface IHitConfig {
  force: '' | 'img' | 'xhr' | 'beacon';
  path: string[];
  payload: Payload;
  maxImgLength: number;
}
