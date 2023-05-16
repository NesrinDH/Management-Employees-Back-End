import { body, validationResult } from 'express-validator';

export const validateRequest = [
    body('firstName').notEmpty().withMessage('FirstName is required').isString().trim().escape().isLength({ min: 3, max: 10 }),
    body('lastName').notEmpty().withMessage('LastName is required').isString().trim().escape().isLength({ min: 3, max: 15 }),
    body('email').isEmail().withMessage('Email is not valid'),
    body('role').notEmpty().withMessage('Role is required').isIn(['Super_Admin', 'Director', 'Administration Director', 'Administration Assistant', 'Human Ressources', 'Team Manager', 'Software Engineer']),
    body('building').notEmpty().withMessage('Building is required').isIn(['Front-End', 'Back-End', 'Full-Stack']),
    body('phone').notEmpty().withMessage('Phone is required').isLength({ min: 12}).withMessage('must be at least 12 chars long'),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];

  export const validateRequestDayoff = [
    body('startDay').notEmpty().withMessage('startDay is required').isDate(),
    body('endDay').notEmpty().withMessage('endDay is required').isDate(),
    body('type').notEmpty().withMessage('type is required').isString().isIn(["Paid", "Unpaid","Sick"]),
    body('JustificationSick').isString(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];  
  
