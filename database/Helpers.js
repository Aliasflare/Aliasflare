import { sql } from "kysely";

export const RANDOM_UUID = sql`(
lower(
    hex(randomblob(4)) || '-' ||                       -- time_low
    hex(randomblob(2)) || '-' ||                       -- time_mid
    '4' || substr(hex(randomblob(2)), 2) || '-' ||     -- version (4xxx)
    substr('89ab', abs(random()) % 4 + 1, 1) ||        -- variant (10xx)
    substr(hex(randomblob(2)), 2) || '-' ||            -- rest of clock_seq
    hex(randomblob(6))                                 -- node
))`;

export const RANDOM_20_TOKEN = sql`(
substr(
    lower(hex(randomblob(16))),   -- 16 random bytes, hex-encoded (32 characters)
    1,                            -- Start at the first character
    20                            -- Take the first 20 characters (out of 32)
))`;