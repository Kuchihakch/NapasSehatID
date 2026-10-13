-- CreateTable
CREATE TABLE "air_quality_logs" (
    "id" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hourBucket" TIMESTAMP(3) NOT NULL,
    "usAqi" INTEGER NOT NULL,
    "pm25" DOUBLE PRECISION NOT NULL,
    "pm10" DOUBLE PRECISION,
    "carbonMonoxide" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION,
    "relativeHumidity" DOUBLE PRECISION,
    "windSpeed" DOUBLE PRECISION,
    "aqiCategory" TEXT NOT NULL,

    CONSTRAINT "air_quality_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screening_assessments" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "hasShortnessOfBreath" BOOLEAN NOT NULL DEFAULT false,
    "hasChronicCough" BOOLEAN NOT NULL DEFAULT false,
    "hasPreExistingCondition" BOOLEAN NOT NULL DEFAULT false,
    "hasSoreThroat" BOOLEAN NOT NULL DEFAULT false,
    "hasIrritatedEyes" BOOLEAN NOT NULL DEFAULT false,
    "calculatedScore" INTEGER NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "recommendations" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "screening_assessments_pkey" PRIMARY KEY ("id")
);
