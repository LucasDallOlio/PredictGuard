"use client";

import { AppWindowMac, HandMetal, Megaphone, Contrast, Brush } from "lucide-react";
import { FolderPlus, FolderPen, FolderMinus, EllipsisVertical } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TableComp = () => {
  const tableActionData = [
    { icon: FolderPlus, listtitle: "Add" },
    { icon: FolderPen, listtitle: "Edit" },
    { icon: FolderMinus, listtitle: "Delete" },
  ];

  const checkboxTableData = [
    {
      project: "Web App Project",
      date: "04 June 2026",
      budget: "12,000",
      icon: AppWindowMac,
      iconcolor: "text-orange-400",
      iconbg: "bg-orange-400/20",
      avatar: "https://images.shadcnspace.com/assets/profiles/user-11.jpg",
      name: "Olivia Rhye",
      handle: "olivia@ui.com",
      progress: 60,
      progressColor: "**:data-[slot=progress-indicator]:bg-orange-400",
    },
    {
      project: "MaterialM Admin",
      date: "09 January 2026",
      budget: "8000",
      icon: HandMetal,
      iconcolor: "text-sky-400",
      iconbg: "bg-sky-400/20",
      avatar: "https://images.shadcnspace.com/assets/profiles/user-8.jpg",
      name: "Barbara Steele",
      handle: "steele@ui.com",
      progress: 30,
      progressColor: "**:data-[slot=progress-indicator]:bg-blue-500",
    },
    {
      project: "Digital Marketing",
      date: "15 April 2026",
      budget: "15,000",
      icon: Megaphone,
      iconcolor: "text-teal-400",
      iconbg: "bg-teal-400/20",
      avatar: "https://images.shadcnspace.com/assets/profiles/user-3.jpg",
      name: "Leonard Gordon",
      handle: "olivia@ui.com",
      progress: 45,
      progressColor: "**:data-[slot=progress-indicator]:bg-amber-300",
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-10 ">

      {/* container maior */}
      <div className="max-w-7xl mx-auto">

        <Card className="w-full shadow-sm">

          <CardHeader className="flex flex-col gap-2">

            <CardTitle className="text-2xl font-semibold">
              Histórico de Solicitações
            </CardTitle>

            <CardDescription>
              Verifique o andamento das solicitações.
            </CardDescription>

          </CardHeader>

          <CardContent className="p-0">

            {/* scroll horizontal mobile */}
            <div className="w-full overflow-x-auto">

              <Table className="min-w-[900px]">

                <TableHeader>
                  <TableRow>

                    <TableHead className="w-[60px] pl-6">
                      <Checkbox />
                    </TableHead>

                    <TableHead>Serviço</TableHead>

                    <TableHead>Budget</TableHead>

                    <TableHead>Técnico</TableHead>

                    <TableHead className="w-[200px]">
                      Status
                    </TableHead>

                    <TableHead className="text-right pr-6">
                      Ações
                    </TableHead>

                  </TableRow>
                </TableHeader>

                <TableBody>

                  {checkboxTableData.map((item, index) => (

                    <TableRow key={index}>

                      {/* checkbox */}
                      <TableCell className="pl-6">
                        <Checkbox />
                      </TableCell>

                      {/* project */}
                      <TableCell>

                        <div className="flex items-center gap-3">

                          <div
                            className={cn(
                              "h-10 w-10 rounded-full flex items-center justify-center",
                              item.iconbg
                            )}
                          >
                            <item.icon
                              size={18}
                              className={item.iconcolor}
                            />
                          </div>

                          <div>

                            <p className="font-medium">
                              {item.project}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              {item.date}
                            </p>

                          </div>

                        </div>

                      </TableCell>

                      {/* budget */}
                      <TableCell className="font-medium">
                        ${item.budget}
                      </TableCell>

                      {/* manager */}
                      <TableCell>

                        <div className="flex items-center gap-3">

                          <img
                            src={item.avatar}
                            alt=""
                            className="h-10 w-10 rounded-full"
                          />

                          <div>

                            <p className="font-medium">
                              {item.name}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              {item.handle}
                            </p>

                          </div>

                        </div>

                      </TableCell>

                      {/* progress */}
                      <TableCell>

                        <Progress
                          value={item.progress}
                          className={cn(
                            "w-full h-2",
                            item.progressColor
                          )}
                        />

                      </TableCell>

                      {/* actions */}
                      <TableCell className="text-right pr-6">

                        <DropdownMenu>

                          <DropdownMenuTrigger asChild>

                            <button className="p-2 rounded-md hover:bg-muted">
                              <EllipsisVertical size={18} />
                            </button>

                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">

                            {tableActionData.map((action, idx) => (

                              <DropdownMenuItem
                                key={idx}
                                className="flex gap-2 cursor-pointer"
                              >
                                <action.icon size={16} />
                                {action.listtitle}
                              </DropdownMenuItem>

                            ))}

                          </DropdownMenuContent>

                        </DropdownMenu>

                      </TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>
  );
};

export default TableComp;