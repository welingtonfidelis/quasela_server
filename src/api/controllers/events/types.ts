export type CreateEventBody = {
  group_id: number;
  name: string;
  description?: string;
  points: number;
  event_date: Date;
  user_ids?: number[];
};

export type UpdateEventBody = {
  id: number;
  name?: string;
  description?: string;
  points?: number;
  event_date?: Date;
  include_user_ids?: number[];
  exclude_user_ids?: number[];
};
