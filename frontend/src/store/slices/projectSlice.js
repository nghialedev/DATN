import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProjectService } from '../../services';

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ProjectService.getAllProjects();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy dự án');
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await ProjectService.getProjectById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy dự án');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await ProjectService.createProject(projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tạo dự án');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const response = await ProjectService.updateProject(id, projectData);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật dự án');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await ProjectService.deleteProject(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa dự án');
    }
  }
);

export const fetchProjectUsers = createAsyncThunk(
  'projects/fetchProjectUsers',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await ProjectService.getUsersInProject(projectId);
      return { projectId, users: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy thành viên dự án');
    }
  }
);

export const addUserToProject = createAsyncThunk(
  'projects/addUserToProject',
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      const response = await ProjectService.addUserToProject(projectId, userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể thêm thành viên vào dự án');
    }
  }
);

export const removeUserFromProject = createAsyncThunk(
  'projects/removeUserFromProject',
  async (assignmentId, { rejectWithValue }) => {
    try {
      await ProjectService.removeUserFromProject(assignmentId);
      return assignmentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa thành viên khỏi dự án');
    }
  }
);

const initialState = {
  projects: [],
  currentProject: null,
  projectUsers: {},
  loading: false,
  error: null
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
    resetCurrentProject: (state) => {
      state.currentProject = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(project => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = { ...state.projects[index], ...action.payload.data };
        }
        if (state.currentProject && state.currentProject.id === action.payload.id) {
          state.currentProject = { ...state.currentProject, ...action.payload.data };
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(project => project.id !== action.payload);
        if (state.currentProject && state.currentProject.id === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch project users
      .addCase(fetchProjectUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.projectUsers[action.payload.projectId] = action.payload.users;
      })
      .addCase(fetchProjectUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add user to project
      .addCase(addUserToProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUserToProject.fulfilled, (state, action) => {
        state.loading = false;
        const projectId = action.payload.project_id.id;
        if (state.projectUsers[projectId]) {
          state.projectUsers[projectId].push(action.payload);
        }
      })
      .addCase(addUserToProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove user from project
      .addCase(removeUserFromProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeUserFromProject.fulfilled, (state, action) => {
        state.loading = false;
        // Update projectUsers state by removing the assignment
        Object.keys(state.projectUsers).forEach(projectId => {
          state.projectUsers[projectId] = state.projectUsers[projectId].filter(
            assignment => assignment.id !== action.payload
          );
        });
      })
      .addCase(removeUserFromProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearProjectError, resetCurrentProject } = projectSlice.actions;
export default projectSlice.reducer; 