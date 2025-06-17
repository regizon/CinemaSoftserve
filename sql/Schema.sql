CREATE TABLE IF NOT EXISTS "Users" (
	"user_id" serial NOT NULL UNIQUE,
	"user_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"role_id" bigint NOT NULL,
	PRIMARY KEY ("user_id")
);

CREATE TABLE IF NOT EXISTS "Roles" (
	"role_id" serial NOT NULL UNIQUE,
	"role_name" varchar(255) NOT NULL UNIQUE,
	PRIMARY KEY ("role_id")
);

CREATE TABLE IF NOT EXISTS "Movies" (
	"movie_id" serial NOT NULL UNIQUE,
	"title" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"duration(minutes)" bigint NOT NULL,
	"img_url" varchar(512) NOT NULL,
	"is_active" boolean NOT NULL,
	PRIMARY KEY ("movie_id")
);

CREATE TABLE IF NOT EXISTS "Genres" (
	"genre_id" serial NOT NULL UNIQUE,
	"genre_name" varchar(255) NOT NULL UNIQUE,
	PRIMARY KEY ("genre_id")
);

CREATE TABLE IF NOT EXISTS "MovieGenres" (
	"movie_id" bigint NOT NULL,
	"genre_id" bigint NOT NULL,
	PRIMARY KEY ("movie_id", "genre_id")
);

CREATE TABLE IF NOT EXISTS "Halls" (
	"hall_id" serial NOT NULL UNIQUE,
	"hall_number" bigint NOT NULL UNIQUE,
	"capacity" bigint NOT NULL,
	PRIMARY KEY ("hall_id")
);

CREATE TABLE IF NOT EXISTS "Sessions" (
	"session_id" serial NOT NULL UNIQUE,
	"movie_id" bigint NOT NULL,
	"hall_id" bigint NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"price" numeric(10,0) NOT NULL,
	PRIMARY KEY ("session_id")
);

CREATE TABLE IF NOT EXISTS "Bookings" (
	"booking_id" serial NOT NULL UNIQUE,
	"user_id" bigint NOT NULL,
	"session_id" bigint NOT NULL,
	"booked_at" timestamp with time zone NOT NULL,
	"status_id" bigint NOT NULL,
	PRIMARY KEY ("booking_id")
);

CREATE TABLE IF NOT EXISTS "Statuses" (
	"status_id" serial NOT NULL UNIQUE,
	"status" varchar(255) NOT NULL,
	PRIMARY KEY ("status_id")
);

ALTER TABLE "Users" ADD CONSTRAINT "Users_fk4" FOREIGN KEY ("role_id") REFERENCES "Roles"("role_id");



ALTER TABLE "MovieGenres" ADD CONSTRAINT "MovieGenres_fk0" FOREIGN KEY ("movie_id") REFERENCES "Movies"("movie_id");

ALTER TABLE "MovieGenres" ADD CONSTRAINT "MovieGenres_fk1" FOREIGN KEY ("genre_id") REFERENCES "Genres"("genre_id");

ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_fk1" FOREIGN KEY ("movie_id") REFERENCES "Movies"("movie_id");

ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_fk2" FOREIGN KEY ("hall_id") REFERENCES "Halls"("hall_id");
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_fk1" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id");

ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_fk2" FOREIGN KEY ("session_id") REFERENCES "Sessions"("session_id");

ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_fk4" FOREIGN KEY ("status_id") REFERENCES "Statuses"("status_id");
