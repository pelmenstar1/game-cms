/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiError, type CreateUserPayload } from '@game-cms/base-core';
import type { ApiRouteId } from '@game-cms/core/api';
import { cms, env } from '@game-cms/global';
import { ObjectId } from 'mongodb';
import { describe, expect, it } from 'vitest';

function service() {
  return cms().service('base::user');
}

async function createTemporalUser(payload: CreateUserPayload) {
  const result = await service().create(payload);

  return {
    result,
    [Symbol.asyncDispose]: async () => {
      await service().delete(result.id);
    },
  };
}

describe('init', () => {
  it('should create admin user on initialization', async () => {
    const { email } = env().config.auth.admin;

    const user = await cms().service('base::user').getByEmail(email);

    expect(new Set(user?.permissions)).toEqual(
      cms().service('base::auth').getAllPermissions()
    );
  });
});

describe('create', () => {
  it('should create a new user successfully', async () => {
    const userService = cms().service('base::user');

    const email = 'newuser@example.com';
    const password = 'password123';
    const displayName = 'New User';
    const permissions: ApiRouteId[] = ['storage$list'];

    await using u = await createTemporalUser({
      email,
      password,
      displayName,
      permissions,
    });

    const user = await userService.getById(u.result.id);

    expect(user).toMatchObject({ email, displayName, permissions });
  });

  it('should throw error when creating duplicate user', async () => {
    const userService = cms().service('base::user');

    const email = 'duplicate@example.com';
    const password = 'password123';
    const displayName = 'Duplicate User';

    await using _ = await createTemporalUser({
      email,
      password,
      displayName,
      permissions: [],
    });

    await expect(
      userService.create({
        email,
        password,
        displayName: 'Another Name',
        permissions: [],
      })
    ).rejects.toThrow(ApiError);
  });
});

describe('getById', () => {
  it('should retrieve user by id', async () => {
    const userService = cms().service('base::user');

    const email = 'getbyid@example.com';
    const displayName = 'Get By Id User';

    await using u = await createTemporalUser({
      email,
      password: 'password123',
      displayName,
      permissions: [],
    });

    const user = await userService.getById(u.result.id);

    expect(user).toMatchObject({ id: u.result.id, email, displayName });
  });

  it('should return null for non-existent user', async () => {
    const userService = cms().service('base::user');

    const user = await userService.getById(new ObjectId());

    expect(user).toBeNull();
  });
});

describe('getByEmail', () => {
  it('should retrieve user by email', async () => {
    const userService = cms().service('base::user');

    const email = 'getbyemail@example.com';
    const displayName = 'Get By Email User';

    await using _ = await createTemporalUser({
      email,
      password: 'password123',
      displayName,
      permissions: [],
    });

    const user = await userService.getByEmail(email);

    expect(user).toMatchObject({ email, displayName });
  });

  it('should return null for non-existent email', async () => {
    const userService = cms().service('base::user');

    const user = await userService.getByEmail('nonexistent@example.com');

    expect(user).toBeNull();
  });
});

describe('delete', () => {
  it('should delete user successfully', async () => {
    const userService = cms().service('base::user');

    const email = 'delete@example.com';

    const { id } = await userService.create({
      email,
      password: 'password123',
      displayName: 'Delete User',
      permissions: [],
    });

    await userService.delete(id);

    const user = await userService.getById(id);

    expect(user).toBeNull();
  });
});

describe('list', () => {
  it('should list users with pagination', async () => {
    const userService = cms().service('base::user');

    const ids = await Promise.all([
      userService
        .create({
          email: 'list1@example.com',
          password: 'password123',
          displayName: 'List User 1',
          permissions: [],
        })
        .then((r) => r.id),
      userService
        .create({
          email: 'list2@example.com',
          password: 'password123',
          displayName: 'List User 2',
          permissions: [],
        })
        .then((r) => r.id),
    ]);

    const result = await userService.list({ size: 10, offset: 0 });

    expect(result.items.length).toBeGreaterThanOrEqual(2);
    expect(result.meta.totalCount).toBeGreaterThanOrEqual(2);

    await Promise.all(ids.map((id) => userService.delete(id)));
  });

  it('should not include password hash in list results', async () => {
    const userService = cms().service('base::user');

    await using u = await createTemporalUser({
      email: 'listnohash@example.com',
      password: 'password123',
      displayName: 'No Hash User',
      permissions: [],
    });

    const result = await userService.list({ size: 10, offset: 0 });

    expect(result.items.every((item) => 'passwordHash' in item)).toBe(false);
  });
});

describe('updatePassword', () => {
  it('should update user password', async () => {
    const userService = cms().service('base::user');

    const email = 'updatepw@example.com';
    const oldPassword = 'oldPassword123';
    const newPassword = 'newPassword456';

    await using _ = await createTemporalUser({
      email,
      password: oldPassword,
      displayName: 'Update Password User',
      permissions: [],
    });

    await userService.updatePassword(email, newPassword);

    const isOldValid = await userService.verifyPassword(email, oldPassword);
    const isNewValid = await userService.verifyPassword(email, newPassword);

    expect(isOldValid).toBe(false);
    expect(isNewValid).toBe(true);
  });
});

describe('updatePasswordIfOldMatches', () => {
  it('should update password when old password matches', async () => {
    const userService = cms().service('base::user');

    const email = 'updatepwmatch@example.com';
    const oldPassword = 'oldPassword123';
    const newPassword = 'newPassword456';

    await using _ = await createTemporalUser({
      email,
      password: oldPassword,
      displayName: 'Update Password Match User',
      permissions: [],
    });

    const result = await userService.updatePasswordIfOldMatches(
      email,
      oldPassword,
      newPassword
    );

    expect(result).toBe(true);

    const isNewValid = await userService.verifyPassword(email, newPassword);
    expect(isNewValid).toBe(true);
  });

  it('should not update password when old password does not match', async () => {
    const userService = cms().service('base::user');

    const email = 'updatepwnomatch@example.com';
    const password = 'correctPassword123';
    const wrongOldPassword = 'wrongPassword';
    const newPassword = 'newPassword456';

    await using _ = await createTemporalUser({
      email,
      password,
      displayName: 'Update Password No Match User',
      permissions: [],
    });

    const result = await userService.updatePasswordIfOldMatches(
      email,
      wrongOldPassword,
      newPassword
    );

    expect(result).toBe(false);

    const isOriginalValid = await userService.verifyPassword(email, password);
    expect(isOriginalValid).toBe(true);
  });
});

describe('verifyPassword', () => {
  it('should return true for correct password', async () => {
    const userService = cms().service('base::user');

    const email = 'verifypw@example.com';
    const password = 'correctPassword123';

    await using _ = await createTemporalUser({
      email,
      password,
      displayName: 'Verify Password User',
      permissions: [],
    });

    const isValid = await userService.verifyPassword(email, password);

    expect(isValid).toBe(true);
  });

  it('should return false for incorrect password', async () => {
    const userService = cms().service('base::user');

    const email = 'verifywrongpw@example.com';
    const password = 'correctPassword123';

    await using _ = await createTemporalUser({
      email,
      password,
      displayName: 'Verify Wrong Password User',
      permissions: [],
    });

    const isValid = await userService.verifyPassword(email, 'wrongPassword');

    expect(isValid).toBe(false);
  });

  it('should return false for non-existent user', async () => {
    const userService = cms().service('base::user');

    const isValid = await userService.verifyPassword(
      'nonexistent@example.com',
      'anyPassword'
    );

    expect(isValid).toBe(false);
  });
});

describe('updateById', () => {
  it('should update user permissions', async () => {
    const userService = cms().service('base::user');

    const email = 'updateperms@example.com';
    const initialPermissions: ApiRouteId[] = ['storage$list'];
    const newPermissions: ApiRouteId[] = [
      'storage$list',
      'user$byId$get',
      'user$create',
    ];

    await using u = await createTemporalUser({
      email,
      password: 'password123',
      displayName: 'Update Permissions User',
      permissions: initialPermissions,
    });

    await userService.updateById(u.result.id, { permissions: newPermissions });

    const user = await userService.getById(u.result.id);

    expect(user?.permissions).toEqual(newPermissions);
  });
});

describe('fullGetBy', () => {
  it('should return user with password hash', async () => {
    const userService = cms().service('base::user');

    const email = 'fullget@example.com';
    const password = 'password123';

    await using _ = await createTemporalUser({
      email,
      password,
      displayName: 'Full Get User',
      permissions: [],
    });

    const user = await userService.fullGetBy({ email });

    expect(user).toBeDefined();
    expect(user?.passwordHash).toBeDefined();
  });
});
