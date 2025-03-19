export type CreateGroupData = {
  owner_id: number;
  name: string;
  description?: string;
  goal_value: number;
};

export type UpdateGroupData = {
  id: number;
  name?: string;
  description?: string;
  goal_value?: number;
  include_user_ids?: number[];
  exclude_user_ids?: number[];
};

export type FindGroupByUserIdData = {
  user_id: number;
  filter_by_name?: string;
  page: number;
  limit: number;
};

export type FindGroupByIdData = {
  id: number;
  include_events?: boolean;
  include_users?: boolean;
};

export type FindGroupByUUIdData = {
  uuid: string;
};

export type DeleteGroupByIdData = {
  id: number;
};
