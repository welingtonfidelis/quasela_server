export type CreateEventPayload = {
  group_id: number;
  name: string;
  description?: string;
  points: number;
  event_date: Date;
  user_ids?: number[];
};

export type UpdateEventPayload = {
  id: number;
  name?: string;
  description?: string;
  points?: number;
  event_date?: Date;
  include_user_ids?: number[];
  exclude_user_ids?: number[];
};

export type FindEventByUserIdPayload = {
  user_id: number;
  filter_by_name?: string;
  page: number;
  limit: number;
};

export type FindEventByIdPayload = {
  id: number;
  include_users?: boolean;
};

export type DeleteEventByIdPayload = {
  id: number;
};
