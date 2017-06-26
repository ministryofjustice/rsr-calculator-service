FORMAT: 1A
HOST: /

## Group OGRS3

The Offender Group Reconviction Scale (OGRS) Version 3

### Calculate OGRS3 [POST /calculate/ogrs3]

Calculates the OGRS3 Score

+ Request Calculate OGRS3 risk (application/json)
    + Parameters
        + gender: `Male`
        + currentOffenceType: 0
        + previousSanctions: 1
        + birthDate: `1989-04-22T00:00:00.000Z`
        + convictionDate: `2013-02-20T00:00:00.000Z`
        + firstSanctionDate: `2001-09-10T00:00:00.000Z`
        + assessmentDate: `2013-03-31T00:00:00.000Z`

    + Schema

            {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "gender": {
                        "type": "string",
                        "description": "Subjects gender"
                    },
                    "birthDate": {
                        "type": "string",
                        "description": "Subjects data of birth"
                    },
                    "convictionDate": {
                        "type": "string",
                        "description": "for sentenced offenders, this is the age at sentence.  For PSRs, it is the offender's current age"
                    },
                    "firstSanctionDate": {
                        "type": "string",
                        "description": "date the subject was first sanctioned"
                    },
                    "previousSanctions": {
                        "type": "number",
                        "description": "a sanction is a caution, reprimand or final warning, or a court appearance resulting in conviction. A sanction can be for one or many offenses, provided they are all dealt with on the same day"
                    },
                    "assessmentDate": {
                        "type": "string",
                        "description": "the date that the offender could be in a position to reoffend again (ignoring offenses committed whilst in custody)"
                    },
                    "currentOffenceType": {
                        "type": "number",
                        "description": "the identifier of the current offense type taken from the OGRS3 current offense categories"
                    }
                },
                "required": [
                    "gender",
                    "birthDate",
                    "convictionDate",
                    "firstSanctionDate",
                    "previousSanctions",
                    "assessmentDate",
                    "currentOffenceType"
                ]
            }

+ Response 200 (application/json)

    Success

    + Attributes (object)
        + OGRS3 (array)
            + 0.8117432421743183
            + 0.8984865665141756
        + OGRS3PercentileRisk (array)
            + 81.17
            + 89.84

    + Schema

            {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "OGRS3": {
                        "type": "array",
                        "description": "the calculated first and second year OGRS3 risk"
                        "items": {
                          "type": "number",
                        }
                    },
                    "OGRS3PercentileRisk": {
                        "type": "array",
                        "description": "the calculated first and second year OGRS3 percentile risk"
                        "items": {
                          "type": "number",
                        }
                    }
                },
                "required": [
                    "OGRS3",
                    "OGRS3PercentileRisk"
                ]
            }
