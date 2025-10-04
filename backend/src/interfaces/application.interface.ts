import { IBase } from "./base.interface";

type IApplicationStatus =
    | "In work"
    | "New"
    | "Aggre"
    | "Disaggre"
    | "Dubbing"
    | null;
type ICourseType = "pro" | "minimal" | "premium" | "incubator" | "vip";
type ICourseFormat = "static" | "online";
type ICourseName = "FS" | "QACX" | "JCX" | "JSCX" | "FE" | "PCX";

interface IApplication extends IBase {
    name: string;
    surname: string;
    email: string;
    phone: string;
    age: number;
    course: ICourseName;
    course_format: ICourseFormat;
    course_type: ICourseType;
    status: IApplicationStatus;
    sum: number;
    alreadyPaid: number;
    manager: string;
    group: string;
    comments?: { text: string; author: string; created_at: Date }[];
}

export {
    IApplicationStatus,
    ICourseType,
    ICourseFormat,
    ICourseName,
    IApplication,
};
