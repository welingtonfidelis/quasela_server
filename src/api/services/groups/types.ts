export type CreateGroupPayload = {
  owner_id: number;
  name: string;
  description: string;
  goal_value: number;
};

export type UpdateGroupPayload = {
  id: number;
  name?: string;
  description?: string;
  goal_value?: number;
  include_user_ids?: number[];
  exclude_user_ids?: number[];
};

export type FindGroupByUserIdPayload = {
  user_id: number;
  filter_by_name?: string;
  page: number;
  limit: number;
};

export type FindGroupByUUIdPayload = {
  uuid: string;
};

export type FindGroupByIdPayload = {
  id: number;
  include_events?: boolean;
  include_users?: boolean;
};

export type DeleteGroupByIdPayload = {
  id: number;
};
