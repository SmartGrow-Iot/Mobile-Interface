# 🌱 Contributing to SmartGrow

Thank you for your interest in **SmartGrow – Smart Plant Monitoring System**! We’re happy to have you on board. This project is a collaborative effort by our team, and contributions of all kinds are welcome — whether it’s code, documentation, ideas, or testing!

---

## 📬 How to Get Started

### ✅ Basic Steps

1. **Fork this repository** to your GitHub account.
2. **Clone your fork** to your local machine.
3. **Create a new branch** for your feature or fix:
    
    ```bash
    git checkout -b your-feature-name
    ```
    
4. Make your changes.
5. **Commit** and **push** them to your fork.
6. **Open a Pull Request (PR)** to this repository’s `main` branch.
    

Refer to this guide if you're new to GitHub:  
👉 [GitHub Contributing Guide](https://docs.github.com/en/get-started/quickstart/contributing-to-projects)

---

## 🧭 Where to Contribute

| Contribution Type       | Where to Look / What to Do                                                             |
| ----------------------- | -------------------------------------------------------------------------------------- |
| 🐛 **Bug Fix**          | Check [Issues]. Assign yourself and describe how you plan to fix it.                   |
| ✨ **New Feature**       | Discuss with the team first. Then open a PR linked to the discussed issue or proposal. |
| 🧪 **Testing**          | Test the UI and sensor integration and report inconsistencies or bugs.                 |
| 📖 **Documentation**    | Improve README, setup instructions, or add usage examples in the `docs/` folder.       |
| 🌱 **Hardware Guide**   | Add or revise plant-care automation wiring/setup steps.                                |
| 💡 **Ideas & Feedback** | Open a new issue with the `idea` tag or contact us directly (see below).               |

---

## 💻 Project Structure (Quick Overview)

```
smartgrow/
│
├── monitoring-dashboard/ # React App
├── backend/          # Python backend API
├── firmware/         # ESP32 Microcontroller code
├── mobile-interface/ # React-native app
├── docs/             # Project documentation
├── .env.example      # Environment variables template
└── README.md         # Main overview
```

---

## 👥 Who to Contact

If you’re unsure about anything, reach out to the team:

| Name                          | Role                        | Username     |
| ----------------------------- | --------------------------- | ------------ |
| Ahmed Awelkair                | Lead SQA Standards          | a7m-1st      |
| Afif Izuddin Siddik           | Code and standards Reviewer | Afif-Izuddin |
| Adeline Kong Earn Ning        | Quality Standard Analyst 1  | iamAden      |
| Yoong Jing Yi                 | Quality Standard Analyst 2  | yoongtaufoo  |
| Noor Aisyah binti Ahmad Saufi | Quality Standard Analyst 3  | aisyah551    |

> You can also open an Issue and tag the relevant person in the description.

---

## 🧪 Code Standards

- **Languages:** **Html/js,** TypeScript (React Native), Python/Node.js, C++ (ESP32).
- **Formatting:** Use Prettier for frontend, ESLint if applicable.
- **Commits:** Follow this format:
    
    ```
    feat: add moisture sensor data display
    fix: correct API response for threshold alert
    docs: update README with new feature info
    ```
    
- **Testing:** Make sure everything runs before submitting a PR.
    

---

## 📑 References & Setup

- **Setup Instructions:** See `README.md`
- **Sensor Docs:** See `docs/sensors.md`
- **API Reference:** See `backend/README.md`
- **Firmware Guide:** See `firmware/README.md`

---

## 🙌 Final Notes

- Keep PRs small and focused.
- Document your changes.
- Ask questions — we're here to help each other!
- Respectfully review and respond to feedback on your PRs.

We’re building something green 🌿 and great together. Thanks for helping SmartGrow thrive!













**  
  

# SQA - Code Standards & Compliance

  

# Pull Request Guidelines

  
  

v0.5

# PR Title: (type): (description) (requirement)  

> Example: `feat: Add sensor calibration (fr01)`

  

For the checklist, put an `x` in all boxes that apply. the boxes that apply should look like - [x] with no spaces.  

For other sections, delete the placeholder text (_the italicized lines_) and replace it with your actual content.  

  

## Type:  

- [x] `feat` (frXX / nfrXX) — New feature  

- [ ] `fix` (bugfix) — Bug fix  

- [x] `docs` — Documentation only changes  

- [ ] `refactor` — Code restructuring without functional changes  

- [ ] `test` — Adding or updating tests  

- [ ] `chore` — Maintenance, build, config, or non-feature tasks

  

_If your PR includes more than one type, choose all that apply and make sure the **title reflects the main purpose**._

for example: if your PR include both adding new feature and bugfixes: check both and use feat as the title, include both the feature and bug fixes in the description

  

## Requirement ID:  

- Single: `(fr01)`  

- Multiple: `(multi)`  

- Not Applicable: *(omit parentheses)*  

  

---

  

## 🧾 Description

  

**What does this PR do?**  

_Briefly explain the purpose and content of the pull request._

  

**Related Components**  

_List any modules, subsystems, or groups that this change touches or depends on._

  

**Which group is responsible?**  

_Indicate your group number (e.g., Group 4 - Web UI)._

  

---

  

## ✅ Checklist

  

- [x] PR title follows the naming convention

- [x] Type and requirement are correctly marked

- [x] My code follows the project's style guidelines

- [ ] Code compiles/runs correctly

- [ ] Tests are included/updated if needed

- [ ] Documentation is updated (if applicable)

  

---

  

## 🧪 Testing Instructions

  

_How can reviewers test this PR? Provide steps, screenshots, or test cases._

  

---

  

## 🔗 Dependencies

  

_List any external dependencies, such as:_

_- Related or prerequisite PRs (`#123`, `#456`)_

_- Specific branches this must be merged after_

_- Required libraries, modules, or services_

  

> Example:

> - Depends on PR #102 (backend API changes)

> - Uses `v2.0.1` of the temperature-sensor module

  

- ## 📌 Additional Notes

  

_Anything reviewers should know, consider, or keep in mind?_

  

---

  
**
