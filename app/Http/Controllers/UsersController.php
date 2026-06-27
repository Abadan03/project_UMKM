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
        $users = $this->formatUsers(
            User::with('roles')
                ->latest()
                ->get()
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
            ->latest()
            ->limit(25)
            ->get();

        return response()->json($this->formatUsers($users));
    }

    private function formatUsers(Collection $users): Collection
    {
        return $users->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'email' => $item->email,
                'roles_id' => $item->roles_id,
                'role' => $item->roles?->name,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        });
    }

    public function create()
    {
        $roles = T_Roles::all();
        return
            Inertia::render('users/form/Create', [
                'roles' => $roles
            ]);
    }
    public function show()
    {
        return Inertia::render('users/form/Create');
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
