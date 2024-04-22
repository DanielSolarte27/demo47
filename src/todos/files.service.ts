import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { File } from "./files.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class FilesService {
    constructor(@InjectRepository(File) private readonly fileRepository: Repository<File>) {}

    async saveFile({
        name,
        mimeType,
        data,
        todo,
    }) : Promise<File> {
        const file = new File();
        file.name = name;
        file.mimeType = mimeType;
        file.data = data;
        file.todo = todo;

        return this.fileRepository.save(file);
    }
}