-- 1. First, create the function that will update the 'updated_at' timestamp.
-- Supabase might already have this, but it's safe to create it.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create tables. Note: Create tables with foreign keys LAST (e.g., user_account first).

-- user_account
CREATE TABLE user_account (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(11),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student'
        CHECK (role IN ('student', 'teacher', 'admin')),
    student_id VARCHAR(64),
    employee_id VARCHAR(64),
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_email UNIQUE (email),
    CONSTRAINT uq_student_id UNIQUE (student_id),
    CONSTRAINT uq_employee_id UNIQUE (employee_id)
);

-- course
CREATE TABLE course (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    course_code VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    credits DECIMAL(3,1) DEFAULT 3.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_course_code UNIQUE (course_code)
);

-- section
CREATE TABLE section (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    course_id INT NOT NULL,
    section_label VARCHAR(32) NOT NULL,
    capacity INT NOT NULL,
    location VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_section_course FOREIGN KEY (course_id)
        REFERENCES course(id) ON DELETE CASCADE
);

-- schedule
CREATE TABLE schedule (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    section_id INT NOT NULL,
    day_of_week VARCHAR(10) NOT NULL
        CHECK (day_of_week IN ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedule_section FOREIGN KEY (section_id)
        REFERENCES section(id) ON DELETE CASCADE
);

-- assignment
CREATE TABLE assignment (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    section_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assignment_section FOREIGN KEY (section_id)
        REFERENCES section(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_user FOREIGN KEY (user_id)
        REFERENCES user_account(id) ON DELETE CASCADE
);

-- enrollment
CREATE TABLE enrollment (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    section_id INT NOT NULL,
    student_id INT NOT NULL,
    CONSTRAINT fk_enrollment_section FOREIGN KEY (section_id)
        REFERENCES section(id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id)
        REFERENCES user_account(id) ON DELETE CASCADE
);

-- accessibility_settings
CREATE TABLE accessibility_settings (
    id INT NOT NULL PRIMARY KEY,
    font_size INT NOT NULL DEFAULT 11,
    theme VARCHAR(20) NOT NULL
        CHECK (theme IN ('dark', 'light')),
    screen_reader BOOLEAN NOT NULL,
    magnification INT NOT NULL,
    color_inversion BOOLEAN NOT NULL,
    CONSTRAINT fk_accessibility_user FOREIGN KEY (id)
        REFERENCES user_account(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- conversation
CREATE TABLE conversation (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    teacher_id INT NOT NULL,
    student_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_conversation_teacher FOREIGN KEY (teacher_id)
        REFERENCES user_account(id) ON DELETE CASCADE,
    CONSTRAINT fk_conversation_student FOREIGN KEY (student_id)
        REFERENCES user_account(id) ON DELETE CASCADE
);

-- message
CREATE TABLE message (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    body TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_message_conversation FOREIGN KEY (conversation_id)
        REFERENCES conversation(id) ON DELETE CASCADE,
    CONSTRAINT fk_message_sender FOREIGN KEY (sender_id)
        REFERENCES user_account(id) ON DELETE CASCADE
);

-- 3. Create indexes (PostgreSQL prefers indexes created separately)
CREATE INDEX idx_user_role ON user_account (role);
CREATE INDEX idx_section_course ON section (course_id);
CREATE INDEX idx_assignment_user ON assignment (user_id);
CREATE INDEX idx_enrollment_student ON enrollment (student_id);
CREATE INDEX idx_enrollment_section ON enrollment (section_id);
CREATE INDEX idx_conversation_teacher ON conversation (teacher_id);
CREATE INDEX idx_conversation_student ON conversation (student_id);
CREATE INDEX idx_message_conversation ON message (conversation_id);
CREATE INDEX idx_message_sender ON message (sender_id);

-- 4. Create triggers for automatic updated_at on ALL tables that have the column
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            CREATE TRIGGER update_%s_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', t, t);
    END LOOP;
END;
$$;