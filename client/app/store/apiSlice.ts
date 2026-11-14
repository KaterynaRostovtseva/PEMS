/** Запити: вхід, реєстрація, вихід, профіль, проєкти, години. */
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import type { AuthUser } from "~/lib/authStorage";

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  companyName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type ProjectStatus = "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
export type StageStatus = "TODO" | "ACTIVE" | "COMPLETED";
export type ProjectRoleName =
  | "PROJECT_MANAGER"
  | "TEAM_LEAD"
  | "DEVELOPER"
  | "DESIGNER"
  | "QA"
  | "DEVOPS"
  | "ANALYST"
  | "BUSINESS_ANALYST";

export type ProjectPerson = {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string | null;
  email: string;
};

export type ProjectMember = {
  id: string;
  userId: string;
  isActive: boolean;
  roleInProject: ProjectRoleName | null;
  user: ProjectPerson;
};

export type ProjectStage = {
  id: string;
  name: string;
  order: number;
  status: StageStatus;
};

export type Project = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  status: ProjectStatus;
  color?: string | null;
};

type ProjectListResponse =
  | Project[]
  | { data: Project[]; meta?: { total: number } };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Project", "User", "TimeEntry", "Profile"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    checkEmail: builder.mutation<{ taken: boolean }, { email: string }>({
      query: (body) => ({
        url: "/auth/check-email",
        method: "POST",
        body,
      }),
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    acceptInvite: builder.mutation<
      AuthResponse,
      { token: string; password: string; firstName: string; lastName: string }
    >({
      query: (body) => ({
        url: "/auth/accept-invite",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    getProfile: builder.query<
      {
        id: string;
        firstName: string;
        lastName: string;
        displayName?: string | null;
        email: string;
        role: string;
        avatar?: string | null;
        organization?: { id: string; name: string };
      },
      void
    >({
      query: () => "/users/me",
      providesTags: ["Profile"],
    }),
    getProjects: builder.query<ProjectListResponse, void>({
      query: () => "/projects?limit=50",
      providesTags: ["Project"],
    }),
    getProject: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Project", id }],
    }),
    createProject: builder.mutation<Project, { name: string; code: string; description?: string }>({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation<
      Project,
      { id: string; name?: string; description?: string | null; status?: ProjectStatus }
    >({
      query: ({ id, ...body }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ["Project", { type: "Project", id }],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
    getStages: builder.query<ProjectStage[], string>({
      query: (projectId) => `/projects/${projectId}/stages`,
      providesTags: (_result, _error, projectId) => [{ type: "Project", id: `${projectId}-stages` }],
    }),
    createStage: builder.mutation<ProjectStage, { projectId: string; name: string; order: number }>({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/stages`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: "Project", id: `${projectId}-stages` }],
    }),
    updateStage: builder.mutation<
      ProjectStage,
      { projectId: string; stageId: string; status?: StageStatus; name?: string }
    >({
      query: ({ projectId, stageId, ...body }) => ({
        url: `/projects/${projectId}/stages/${stageId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: "Project", id: `${projectId}-stages` }],
    }),
    deleteStage: builder.mutation<void, { projectId: string; stageId: string }>({
      query: ({ projectId, stageId }) => ({
        url: `/projects/${projectId}/stages/${stageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: "Project", id: `${projectId}-stages` }],
    }),
    getMembers: builder.query<ProjectMember[], string>({
      query: (projectId) => `/projects/${projectId}/members`,
      providesTags: (_result, _error, projectId) => [{ type: "Project", id: `${projectId}-members` }],
    }),
    addMember: builder.mutation<
      ProjectMember,
      { projectId: string; userId: string; roleInProject?: ProjectRoleName | null }
    >({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/members`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: "Project", id: `${projectId}-members` }],
    }),
    removeMember: builder.mutation<void, { projectId: string; memberId: string }>({
      query: ({ projectId, memberId }) => ({
        url: `/projects/${projectId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: "Project", id: `${projectId}-members` }],
    }),
    getTimeEntries: builder.query<
      | {
          id: string;
          hours?: number;
          status?: string;
          date?: string;
          project?: { id: string; name: string };
        }[]
      | {
          data: {
            id: string;
            hours?: number;
            status?: string;
            date?: string;
            project?: { id: string; name: string };
          }[];
        },
      void
    >({
      query: () => "/time-entries?limit=20",
      providesTags: ["TimeEntry"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useCheckEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useAcceptInviteMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetStagesQuery,
  useCreateStageMutation,
  useUpdateStageMutation,
  useDeleteStageMutation,
  useGetMembersQuery,
  useAddMemberMutation,
  useRemoveMemberMutation,
  useGetTimeEntriesQuery,
} = apiSlice;
