export type CreateEventData = {
  group_id: number;
  name: string;
  description?: string;
  points: number;
  event_date: Date;
  user_ids?: number[];
};

export type UpdateEventData = {
  id: number;
  name?: string;
  description?: string;
  points?: number;
  event_date?: Date;
  include_user_ids?: number[];
  exclude_user_ids?: number[];
};

export type FindEventByUserIdData = {
  user_id: number;
  filter_by_name?: string;
  page: number;
  limit: number;
};

export type FindEventByIdData = {
  id: number;
  include_users?: boolean;
};

export type DeleteEventByIdData = {
  id: number;
};
