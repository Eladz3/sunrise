# Firestore Service Usage Guide

## Quick Start

### 1. Create a Document

```typescript
import { createDocument } from '@/services/firebase/firestore';

interface Event {
  title: string;
  description: string;
  startTime: Date;
  createdBy: string;
}

async function createEvent(eventData: Event) {
  const eventId = await createDocument('events', eventData);
  console.log('Created event:', eventId);
  return eventId;
}
```

### 2. Get a Document

```typescript
import { getDocument } from '@/services/firebase/firestore';

interface Event {
  title: string;
  description: string;
  startTime: Date;
  createdBy: string;
}

async function getEvent(eventId: string) {
  const event = await getDocument<Event>('events', eventId);

  if (event) {
    console.log('Event:', event.title);
    return event;
  } else {
    console.log('Event not found');
    return null;
  }
}
```

### 3. Get Multiple Documents

```typescript
import { getDocuments, where, orderBy, limit } from '@/services/firebase/firestore';

// Get all events
const allEvents = await getDocuments('events');

// Get upcoming events
const upcomingEvents = await getDocuments(
  'events',
  where('startTime', '>', new Date()),
  orderBy('startTime', 'asc'),
  limit(10)
);

// Get events by user
const userEvents = await getDocuments(
  'events',
  where('createdBy', '==', userId)
);
```

### 4. Update a Document

```typescript
import { updateDocument } from '@/services/firebase/firestore';

async function updateEvent(eventId: string, updates: Partial<Event>) {
  await updateDocument('events', eventId, updates);
  console.log('Event updated');
}

// Usage
await updateEvent('event123', {
  title: 'Updated Event Title',
  description: 'New description'
});
```

### 5. Delete a Document

```typescript
import { deleteDocument } from '@/services/firebase/firestore';

async function deleteEvent(eventId: string) {
  await deleteDocument('events', eventId);
  console.log('Event deleted');
}
```

## Available Functions

### CRUD Operations

- **`getDocument<T>(collection, id)`** - Get single document
- **`getDocuments<T>(collection, ...constraints)`** - Get multiple documents
- **`createDocument<T>(collection, data)`** - Create new document (auto ID)
- **`setDocument<T>(collection, id, data)`** - Create/overwrite with specific ID
- **`updateDocument<T>(collection, id, data)`** - Update existing document
- **`deleteDocument(collection, id)`** - Delete document

### Query Constraints

- **`where(field, operator, value)`** - Filter documents
- **`orderBy(field, direction)`** - Sort documents
- **`limit(count)`** - Limit results

## Timestamps

All documents automatically get `createdAt` and `updatedAt` timestamps:

```typescript
interface EventWithTimestamps {
  id: string;
  title: string;
  createdAt: FirestoreTimestamp;  // Added automatically
  updatedAt: FirestoreTimestamp;  // Added automatically
}

// Convert Firestore Timestamp to Date
const event = await getDocument<Event>('events', 'event123');
const createdDate = event.createdAt.toDate();
console.log(createdDate); // JavaScript Date object
```

## Example: Build a Custom Service

```typescript
// services/events.ts
import {
  getDocument,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  where,
  orderBy,
} from '@/services/firebase/firestore';
import type { FirestoreTimestamp } from '@/types/firebase';

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  createdBy: string;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

const COLLECTION = 'events';

export async function getAllEvents(): Promise<Event[]> {
  return getDocuments<Event>(
    COLLECTION,
    orderBy('startTime', 'asc')
  );
}

export async function getUpcomingEvents(): Promise<Event[]> {
  return getDocuments<Event>(
    COLLECTION,
    where('startTime', '>', new Date()),
    orderBy('startTime', 'asc')
  );
}

export async function getUserEvents(userId: string): Promise<Event[]> {
  return getDocuments<Event>(
    COLLECTION,
    where('createdBy', '==', userId)
  );
}

export async function getEventById(id: string): Promise<Event | null> {
  return getDocument<Event>(COLLECTION, id);
}

export async function createEvent(
  data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  return createDocument(COLLECTION, data);
}

export async function updateEvent(
  id: string,
  data: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  return updateDocument(COLLECTION, id, data);
}

export async function deleteEvent(id: string): Promise<void> {
  return deleteDocument(COLLECTION, id);
}
```

Then use it in your components:

```typescript
import { getAllEvents, createEvent } from '@/services/events';

// In your component
const events = await getAllEvents();
const newEventId = await createEvent({
  title: 'Team Meeting',
  description: 'Monthly sync',
  startTime: new Date('2024-02-01T10:00:00'),
  endTime: new Date('2024-02-01T11:00:00'),
  createdBy: user.uid,
});
```

## Error Handling

All functions throw errors on failure. Always use try/catch:

```typescript
try {
  const event = await getDocument('events', eventId);
  // Handle success
} catch (error) {
  console.error('Failed to get event:', error);
  // Handle error
}
```

## Type Safety

Use TypeScript generics for type-safe operations:

```typescript
interface User {
  name: string;
  email: string;
  avatar?: string;
}

// TypeScript knows the return type
const user = await getDocument<User>('users', userId);
console.log(user?.name); // ✅ Type-safe
console.log(user?.invalidField); // ❌ TypeScript error
```
