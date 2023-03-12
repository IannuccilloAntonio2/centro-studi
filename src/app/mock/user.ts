export interface User {
  id?: number;
  name: string;
  surname: string;
  email:string;
  courseId?: number;
  alias?:string;
  presente?:boolean;
  aggiunto?:boolean;
}
