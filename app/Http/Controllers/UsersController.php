<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\T_Roles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Users\CreateUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Collection;
// use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    //
    public function index()
    {
        $roles = T_Roles::all();
        $users = formatUsers(
            User::with('roles')
                ->paginate(10)
        );

        return
            Inertia::render('users/Index', [
                'users' => $users,
                'roles' => $roles
            ]);
    }

    public function search(Request $request)
    {
        $keyword = trim((string) $request->query('query'));

        if ($keyword === '') {
            return response()->json([]);
        }

        $like = '%' . addcslashes($keyword, '\%_') . '%';

        $users = User::with('roles')
            ->where(function ($query) use ($like) {
                $query->where('name', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhereHas('roles', function ($roleQuery) use ($like) {
                        $roleQuery->where('name', 'like', $like);
                    });
            })
            ->paginate(10);

        return response()->json(formatUsers($users));
    }

    public function create()
    {
        $roles = T_Roles::all();
        return
            Inertia::render('users/form/Create', [
                'roles' => $roles
            ]);
    }

    public function store(CreateUserRequest $request)
    {
        $data = $request->validated();

        User::create([
            ...$data,
            'password' => Hash::make($data['password']),
        ]);

        return redirect()->route('user.index');
    }
    public function edit(int $userId)
    {
        $user = User::findOrFail($userId);
        $roles = T_Roles::all();
        return
            Inertia::render('users/form/Edit', [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles_id' => $user->roles_id,
                ],
                'roles' => $roles
            ]);
    }
    public function update(UpdateUserRequest $request, int $userId)
    {
        $user = User::findOrFail($userId);
        $data = $request->validated();

        if ($request->boolean('change_password')) {
            // Cek old password match
            if (!$request->validateOldPassword()) {
                return back()->withErrors([
                    'old_password' => 'The Old password does not match.'
                ])->withInput();
            }

            // Cek new password == confirm password
            if ($request->password !== $request->password_confirmation) {
                return back()->withErrors([
                    'password_confirmation' => 'The password field confirmation does not match.',
                ])->withInput();
            }
        }

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        unset($data['old_password'], $data['password_confirmation']);

        $user->update($data);

        return back()->with('success', 'User berhasil diperbarui');
    }

    public function destroy(int $userId)
    {
        $user = User::findOrFail($userId);

        $user->delete();

        return back()->with('success', 'User berhasil dihapus');
    }
}
