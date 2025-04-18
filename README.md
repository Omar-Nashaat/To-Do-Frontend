# Todo List Application Frontend

A modern, responsive Todo List application built with React and TypeScript, featuring drag-and-drop task management and real-time updates.

## Features

### Todo Lists Management

- Create, edit, and delete todo lists
- View completion percentage for each list
- Responsive grid layout for multiple lists
- Loading states and animations for better UX

### Task Management

- Create, edit, delete, and reorder tasks using drag-and-drop
- Mark tasks as complete/incomplete
- Individual loading states for each action
- Keyboard shortcuts for task management
  - Enter: Create new task
  - Escape: Cancel editing
  - Delete/Backspace: Delete selected task
  - Space: Toggle task completion
  - E: Edit selected task

### User Interface

- Modern and clean design with smooth animations
- Loading indicators for all async operations
- Empty state animations
- Toast notifications for action feedback
- Progress bars for list completion
- Responsive layout for all screen sizes

### Technical Features

- Real-time task reordering with optimistic updates
- Error handling with automatic rollback
- Loading states per task for better UX
- Decimal precision for completion percentages
- Efficient state management
- TypeScript for better type safety

## Technologies Used

- React
- TypeScript
- TailwindCSS
- React Icons
- React Hot Toast
- DND Kit (for drag and drop)
- Axios

## Project Structure

```
src/
├── assets/           # Static assets and images
│   ├── login/       # Login page assets
│   ├── register/    # Registration page assets
│   └── todos/       # Todo-related assets
├── components/      # Reusable UI components
│   ├── EmptyAnimation.tsx   # Empty state animations
│   ├── Layout.tsx           # Main app layout with navigation
│   ├── LoadingScreen.tsx    # Loading spinners and states
│   └── ProtectedRoute.tsx   # Auth route protection
├── interfaces/     # TypeScript interfaces
│   ├── Auth.ts            # Authentication types
│   ├── Components.ts      # Component props types
│   ├── Task.ts           # Task-related interfaces
│   └── Todo.ts           # Todo list interfaces
├── pages/         # Main application pages
│   ├── Home.tsx          # Todo lists overview
│   ├── Login.tsx         # User login
│   ├── Register.tsx      # User registration
│   └── TodoList.tsx      # Individual todo list
├── services/      # API and utilities
│   └── api/
│       └── axios.tsx      # Axios instance setup
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables in `.env`:
```
VITE_API_URL=your_backend_url
VITE_ENCRYPTION_KEY=your_encryption_key
```

Working exmaple (my credentials):

```
VITE_ENCRYPTION_KEY=a0f1e2d3c4b5a6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a0b1c2d3
VITE_API_URL=http://localhost:5000

```

3. Start the development server:

```bash
npm start
```

4. Build for production:

```bash
npm run build
```


## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
