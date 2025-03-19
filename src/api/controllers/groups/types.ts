export type CreateGroupBody = {
  name: string;
  description: string;
  goal_value: number;
};

export type UpdateGroupBody = {
  id: number;
  name?: string;
  description?: string;
  goal_value?: number;
  include_user_ids?: number[];
  exclude_user_ids?: number[];
};
