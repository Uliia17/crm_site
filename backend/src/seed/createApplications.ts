import mongoose from "mongoose";
import { config } from "../configs/config";
import ApplicationModel from "../models/application.model";

const SAMPLE_APPLICATIONS = [
    {
        name: "Ivan",
        surname: "Petrenko",
        email: "ivan.petrenko@example.com",
        phone: "+380501234567",
        age: 25,
        course: "FS",
        course_format: "online",
        course_type: "pro",
        status: "New",
        sum: 1200,
        alreadyPaid: 0,
        manager: null,
        group: null,
        comments: [],
    },
    {
        name: "Oksana",
        surname: "Koval",
        email: "oksana.koval@example.com",
        phone: "+380631234567",
        age: 29,
        course: "FE",
        course_format: "static",
        course_type: "minimal",
        status: "In work",
        sum: 900,
        alreadyPaid: 300,
        manager: "manager1@example.com",
        group: "G1",
        comments: [
            {
                text: "Клієнт цікавиться оплатою частинами",
                author: "manager1@example.com",
                created_at: new Date(),
            },
        ],
    },
    {
        name: "Dmytro",
        surname: "Sydorenko",
        email: "dmytro.s@example.com",
        phone: "+380971234567",
        age: 32,
        course: "QACX",
        course_format: "online",
        course_type: "premium",
        status: "Aggre",
        sum: 1500,
        alreadyPaid: 1500,
        manager: "manager2@example.com",
        group: null,
        comments: [],
    },
    {
        name: "Natalia",
        surname: "Shevchenko",
        email: "natalia.shev@example.com",
        phone: "+380501112233",
        age: 22,
        course: "JSCX",
        course_format: "static",
        course_type: "incubator",
        status: "New",
        sum: 700,
        alreadyPaid: 0,
        manager: null,
        group: null,
        comments: [],
    },
    {
        name: "Ivan",
        surname: "Petrenko",
        email: "ivan.petrenko@example.com",
        phone: "+380661112233",
        age: 28,
        course: "FS",
        course_format: "online",
        course_type: "pro",
        status: "New",
        sum: 1200,
        alreadyPaid: 0,
        manager: null,
        group: null,
        comments: [
            {
                text: "Client called, interested",
                author: "system",
                created_at: "2025-09-01T10:00:00Z",
            },
        ],
    },
    {
        name: "Maria",
        surname: "Kovalenko",
        email: "maria.kovalenko@example.com",
        phone: "+380673334455",
        age: 23,
        course: "FE",
        course_format: "static",
        course_type: "minimal",
        status: "In work",
        sum: 800,
        alreadyPaid: 200,
        manager: "Olena",
        group: "A1",
        comments: [
            {
                text: "Payment done",
                author: "Olena",
                created_at: "2025-09-05T09:30:00Z",
            },
        ],
    },
    {
        name: "Dmytro",
        surname: "Bondar",
        email: "dmytro.bondar@example.com",
        phone: "+380501234567",
        age: 30,
        course: "QACX",
        course_format: "online",
        course_type: "premium",
        status: "Aggre",
        sum: 1500,
        alreadyPaid: 1500,
        manager: "Ivan",
        group: "B2",
        comments: [
            {
                text: "Contract signed",
                author: "Ivan",
                created_at: "2025-09-10T14:12:00Z",
            },
        ],
    },
    {
        name: "Olga",
        surname: "Shevchenko",
        email: "olga.shevchenko@example.com",
        phone: "+380632223344",
        age: 26,
        course: "JSCX",
        course_format: "static",
        course_type: "incubator",
        status: "New",
        sum: 500,
        alreadyPaid: 0,
        manager: null,
        group: null,
        comments: [],
    },
    {
        name: "Pavlo",
        surname: "Hryn",
        email: "pavlo.hryn@example.com",
        phone: "+380977778889",
        age: 22,
        course: "JCX",
        course_format: "online",
        course_type: "vip",
        status: "Dubbing",
        sum: 2000,
        alreadyPaid: 500,
        manager: "Olena",
        group: "VIP",
        comments: [
            {
                text: "Needs special schedule",
                author: "Olena",
                created_at: "2025-09-12T11:00:00Z",
            },
        ],
    },
    {
        name: "Kateryna",
        surname: "Bondarenko",
        email: "kate.bond@example.com",
        phone: "+380631112233",
        age: 29,
        course: "PCX",
        course_format: "static",
        course_type: "minimal",
        status: "New",
        sum: 700,
        alreadyPaid: 0,
        manager: null,
        group: null,
        comments: [],
    },
    {
        name: "Sergiy",
        surname: "Maliuk",
        email: "serg.maliuk@example.com",
        phone: "+380981234567",
        age: 35,
        course: "FS",
        course_format: "online",
        course_type: "pro",
        status: "In work",
        sum: 1200,
        alreadyPaid: 600,
        manager: "Ivan",
        group: "A2",
        comments: [
            {
                text: "Follow up in 2 days",
                author: "Ivan",
                created_at: "2025-09-15T09:00:00Z",
            },
        ],
    },
    {
        name: "Tetiana",
        surname: "Lysenko",
        email: "t.lysenko@example.com",
        phone: "+380671234567",
        age: 24,
        course: "FE",
        course_format: "online",
        course_type: "premium",
        status: "Aggre",
        sum: 900,
        alreadyPaid: 900,
        manager: "Olena",
        group: "A1",
        comments: [],
    },
    {
        name: "Orest",
        surname: "Romanenko",
        email: "orest.roman@example.com",
        phone: "+380504445566",
        age: 27,
        course: "QACX",
        course_format: "static",
        course_type: "pro",
        status: "Disaggre",
        sum: 600,
        alreadyPaid: 0,
        manager: null,
        group: null,
        comments: [
            {
                text: "Declined offer",
                author: "system",
                created_at: "2025-09-20T16:00:00Z",
            },
        ],
    },
    {
        name: "Iryna",
        surname: "Ponomarenko",
        email: "iryna.ponomarenko@example.com",
        phone: "+380631234890",
        age: 31,
        course: "FS",
        course_format: "online",
        course_type: "minimal",
        status: "New",
        sum: 400,
        alreadyPaid: 0,
        manager: null,
        group: null,
        comments: [],
    },
];

async function seed() {
    if (!config.MONGO_URI) {
        console.error("MONGO_URI not defined in config, aborting");
        process.exit(1);
    }

    try {
        console.log(
            "Connecting to Mongo:",
            config.MONGO_URI.split("@")[0] + "@***",
        );
        await mongoose.connect(config.MONGO_URI);

        // Якщо хочеш **очистити** колекцію перед seeding'ом — встанови SEED_FORCE=true
        if (process.env.SEED_FORCE === "true") {
            console.log("SEED_FORCE=true — очищаю collection Application ...");
            await ApplicationModel.deleteMany({});
        }

        // Вставити приклади (duplicate унікальності email не перевіряється)
        const inserted = await ApplicationModel.insertMany(SAMPLE_APPLICATIONS);
        console.log(`Inserted ${inserted.length} applications.`);

        // Додатково — показати кількість в DB
        const total = await ApplicationModel.countDocuments();
        console.log(`Total applications in DB: ${total}`);

        await mongoose.disconnect();
        console.log("Disconnected, seed finished.");
        process.exit(0);
    } catch (err) {
        console.error("Seed error:", err);
        try {
            await mongoose.disconnect();
        } catch (err) {
            console.error("Unexpected error in seed:", err);
        }
        process.exit(1);
    }
}

seed();
