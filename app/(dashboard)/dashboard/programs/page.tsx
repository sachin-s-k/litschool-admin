"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPrograms, createProgram, updateProgramStatus, updateProgram } from "@/app/api/programs";
import { useToast } from "@/hooks/use-toast";

interface Program {
  _id: string;
  name: string;
  description: string;
  duration: number;
  prefix: string;
  status: boolean;
}

export default function ProgramsPage() {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProgram, setNewProgram] = useState<Omit<Program, "_id" | "status">>({
    name: "",
    description: "",
    duration: 0,
    prefix: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const fetchPrograms = async () => {
    try {
      const programsData = await getPrograms();
      setPrograms(programsData.data);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const validateFields = () => {
    const duplicateName = programs.some(
      (program) => program.name === newProgram.name && program._id !== selectedProgram
    );
    const duplicatePrefix = programs.some(
      (program) => program.prefix === newProgram.prefix && program._id !== selectedProgram
    );

    const newErrors = {
      name: !newProgram.name
        ? "Program Name is required"
        : duplicateName
        ? "Program name already exists"
        : "",
      description: !newProgram.description ? "Description is required" : "",
      duration: newProgram.duration <= 0 ? "Duration is required" : "",
      prefix: !newProgram.prefix
        ? "Program Prefix is required"
        : duplicatePrefix
        ? "Program prefix already exists"
        : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleCreateOrUpdateProgram = async () => {


    try {
      if (editMode && selectedProgram) {
        if (!validateFields()) {
          return;
        }
        await updateProgram(selectedProgram, newProgram);
        toast({ title: "Program updated successfully!", variant: "success" });
      } else {
        if (!validateFields()) {
          return;
        }
        await createProgram(newProgram);
        toast({ title: "Program created successfully!", variant: "success" });
      }
      await fetchPrograms();
      setOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast({ title: "Failed to create program", description: errorMessage, variant: "destructive" });
    }
  };

  const handleEditProgram = (program: Program) => {
    setEditMode(true);
    setSelectedProgram(program._id);
    setNewProgram({
      name: program.name,
      description: program.description,
      duration: program.duration,
      prefix: program.prefix,
    });
    setErrors({});
    setOpen(true);
  };

  const toggleProgramStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateProgramStatus(id, !currentStatus);
      toast({ title: "Program updated successfully!", variant: "success" });
      await fetchPrograms();
    } catch (error) {
      console.error("Failed to update program status:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Programs</h1>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              setEditMode(false);
              setSelectedProgram(null);
              setNewProgram({ name: "", description: "", duration: 0, prefix: "" });
              setErrors({});
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setEditMode(false)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Program
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? "Edit Program" : "Create New Program"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Program Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Creator Marketer"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief summary of the program"
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (months)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="6"
                    value={newProgram.duration}
                    onChange={(e) => setNewProgram({ ...newProgram, duration: Number(e.target.value) })}
                  />
                  {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prefix">Program Prefix</Label>
                  <Input
                    id="prefix"
                    placeholder="e.g., CM"
                    className="uppercase"
                    value={newProgram.prefix}
                    onChange={(e) => setNewProgram({ ...newProgram, prefix: e.target.value.toUpperCase() })}
                  />
                  {errors.prefix && <p className="text-red-500 text-sm">{errors.prefix}</p>}
                </div>
              </div>
              <Button className="w-full" onClick={handleCreateOrUpdateProgram}>
                {editMode ? "Update Program" : "Create Program"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground border-b border-t py-4 mx-16">Loading...</div>
      ) : programs.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Prefix</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((program) => (
              <TableRow key={program._id}>
                <TableCell>{program.name}</TableCell>
                <TableCell>{program.description}</TableCell>
                <TableCell>{program.duration} months</TableCell>
                <TableCell>{program.prefix}</TableCell>
                <TableCell>{program.status ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleEditProgram(program)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleProgramStatus(program._id, program.status)}
                    className={program.status ? "text-destructive" : "text-[#2EB88A]"}
                  >
                    {program.status ? "Disable" : "Enable"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-muted-foreground border-b border-t py-4 mx-16">No Programs Available</div>
      )}
    </div>
  );
}
