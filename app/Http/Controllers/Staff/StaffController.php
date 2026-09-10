<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\CreateStaffRequest;
use App\Models\T_Roles;
use App\Models\T_Staff;
use App\Models\User;
use Illuminate\Http\Request;
// use App\Repositories\Staff\StaffRepository;
use App\Repositories\Staff\StaffRepository;
use Inertia\Inertia;

class StaffController extends Controller
{
    //
    protected $staffRepository;

    public function __construct(StaffRepository $staffRepository)
    {
        $this->staffRepository = $staffRepository;
    }


    public function index()
    {
        $roles = T_Roles::all();
        $filtered = T_Staff::with('user', 'roles')->latest()->get();
        $staff = formatStaff(
            T_Staff::with('user', 'roles')
                ->latest()
                ->get()
        );

        return
            Inertia::render('staff/Index', [
                'staffs' => $staff,
                'roles' => $roles
            ]);
    }

    public function store(CreateStaffRequest $request)
    {


        // T_Staff::create($validated);
        try {
            // Data sudah otomatis tervalidasi oleh CreateStaffRequest
            $this->staffRepository->create($request->validated());

            return redirect()->back()->with('success', 'Staff created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to create staff: ' . $e->getMessage());
        }
    }

    // public function edit($staffId)
    // {
    //     $staff = $this->staffRepository->findById($staffId);

    //     if (!$staff) {
    //         return redirect()->back()->with('error', 'Staff not found.');
    //     }

    //     $roles = T_Roles::all();

    //     return Inertia::render('staff/form/Edit', [
    //         'staff' => $staff,
    //         'roles' => $roles
    //     ]);
    // }

    public function update(CreateStaffRequest $request, $staffId)
    {
        $staff = $this->staffRepository->findById($staffId);

        if (!$staff) {
            return redirect()->back()->with('error', 'Staff not found.');
        }

        try {
            $this->staffRepository->update($staff, $request->validated());

            return redirect()->back()->with('success', 'Staff updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update staff: ' . $e->getMessage());
        }
    }

    public function destroy($staffId)
    {
        // $staff = $this->staffRepository->findById($staffId);

        if (!$staffId) {
            return redirect()->back()->with('error', 'Staff not found.');
        }

        try {
            $this->staffRepository->delete($staffId);

            return redirect()->back()->with('success', 'Staff deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete staff: ' . $e->getMessage());
        }
    }
}
